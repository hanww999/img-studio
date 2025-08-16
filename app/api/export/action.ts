'use server'

import { getUserEmail } from '../auth-utils';
import { addNewFirestoreEntry } from '../firestore/action';
import { ExportMediaFormI, ExportMediaFormFieldsI } from '../export-utils';

/**
 * Server Action to save media metadata to the Firestore library.
 * It securely gets the user's email on the server-side and adds it
 * to the record, ensuring data ownership.
 *
 * @param entryID - A unique ID for the media entry.
 * @param data - The form data containing the media to export and other details.
 * @param exportImageFormFields - The definition of the form fields.
 * @returns An object indicating success or an error message.
 */
export async function saveMediaToLibrary(
  entryID: string,
  data: ExportMediaFormI,
  exportImageFormFields: ExportMediaFormFieldsI
) {
  try {
    // 1. 在服务器端安全地获取当前用户的 email
    const userEmail = getUserEmail();

    // 2. 调用原始的 addNewFirestoreEntry 函数，并将 userEmail 作为最后一个参数传入
    const result = await addNewFirestoreEntry(
      entryID,
      data,
      exportImageFormFields,
      userEmail // 传入用户 email 以记录所有权
    );

    // 检查 Firestore 操作是否返回了错误
    if (typeof result === 'object' && result.error) {
      throw new Error(result.error);
    }

    // 成功，返回包含时间戳的结果
    return { success: true, timestamp: result };

  } catch (error) {
    console.error("Failed to save to library:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    // 返回一个包含错误信息的对象给前端
    return { error: `Failed to save media to the library. Details: ${errorMessage}` };
  }
}
