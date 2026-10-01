/**
 * Google Workspace (Drive & Gmail) Integration Service
 * Follows Google Workspace API specifications and safety requirements.
 */

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  body?: string;
  labelIds?: string[];
}

/**
 * List files from Google Drive
 */
export async function fetchDriveFiles(
  accessToken: string,
  searchQuery?: string,
  pageSize: number = 25
): Promise<DriveFileItem[]> {
  const queryParams = new URLSearchParams({
    pageSize: pageSize.toString(),
    fields: 'files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink, iconLink)',
    orderBy: 'modifiedTime desc',
  });

  if (searchQuery && searchQuery.trim()) {
    // Escape single quotes for drive query
    const escaped = searchQuery.replace(/'/g, "\\'");
    queryParams.append('q', `name contains '${escaped}' and trashed = false`);
  } else {
    queryParams.append('q', 'trashed = false');
  }

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Upload a file directly to Google Drive
 */
export async function uploadFileToDrive(
  accessToken: string,
  file: File,
  folderId?: string
): Promise<DriveFileItem> {
  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Drive upload error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

/**
 * Create a new folder in Google Drive
 */
export async function createDriveFolder(
  accessToken: string,
  folderName: string,
  parentId?: string
): Promise<DriveFileItem> {
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) {
    metadata.parents = [parentId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Drive folder creation error: ${errorText}`);
  }

  return await response.json();
}

/**
 * Permanently or trash delete a Google Drive file
 * Note: Must be guarded by explicit confirmation dialog.
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const errorText = await response.text();
    throw new Error(`Failed to delete Drive file: ${errorText}`);
  }
}

/**
 * Fetch messages list from Gmail
 */
export async function fetchGmailMessages(
  accessToken: string,
  maxResults: number = 20,
  searchQuery?: string
): Promise<GmailMessageItem[]> {
  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
  });

  if (searchQuery && searchQuery.trim()) {
    params.append('q', searchQuery);
  }

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!listRes.ok) {
    const errorText = await listRes.text();
    throw new Error(`Gmail API error (${listRes.status}): ${errorText}`);
  }

  const listData = await listRes.json();
  const rawList: { id: string; threadId: string }[] = listData.messages || [];

  if (rawList.length === 0) {
    return [];
  }

  // Fetch full details for the top messages in parallel
  const details = await Promise.all(
    rawList.slice(0, 15).map(async (msg) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!msgRes.ok) return null;
        const msgData = await msgRes.json();
        
        // Extract headers
        const headers = msgData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown';
        const to = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: msgData.id,
          threadId: msgData.threadId,
          snippet: msgData.snippet,
          subject,
          from,
          to,
          date,
          labelIds: msgData.labelIds || [],
        } as GmailMessageItem;
      } catch {
        return null;
      }
    })
  );

  return details.filter((d): d is GmailMessageItem => d !== null);
}

/**
 * Send an email via Gmail API
 * Note: Must be guarded by explicit confirmation dialog before invoking.
 */
export async function sendGmailEmail(
  accessToken: string,
  params: {
    to: string;
    subject: string;
    bodyText: string;
  }
): Promise<{ id: string; threadId: string }> {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`;
  const messageParts = [
    `To: ${params.to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    params.bodyText,
  ];
  const rawMessage = messageParts.join('\r\n');

  // URL-safe Base64 encode
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email via Gmail: ${errorText}`);
  }

  return await response.json();
}
