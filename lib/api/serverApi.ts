import { cookies } from 'next/headers';
import { nextServer } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
interface AxiosNotesResponse {
  notes: Note[];
  totalPages: number;
}
export const fetchNotes = async (
  query: string,
  page: number,
  tag?: string
): Promise<AxiosNotesResponse> => {
  const cookieStore = await cookies();
  const response = await nextServer.get<AxiosNotesResponse>('/notes', {
    headers: {
      Cookie: cookieStore.toString(),
    },
    params: {
      page,
      perPage: 12,
      ...(query.trim() ? { search: query } : {}),
      tag: tag === 'all' || !tag ? undefined : tag,
    },
  });
  return response.data;
};
export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
 const response = await nextServer.get<Note>(`/notes/${id}`,
{headers: {
    Cookie: cookieStore.toString(),
}}
 );
  return response.data;
};
export const getMe = async ():Promise<User> => {
  const cookieStore = await cookies();
  const res = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};
export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};
