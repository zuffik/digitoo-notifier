import axios from 'axios';
import { ConfigProvider } from './index';

const client = axios.create({
  baseURL: ConfigProvider.setup.gitlab.baseUrl,
  headers: {
    Authorization: `Bearer ${ConfigProvider.setup.gitlab.accessToken}`,
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

export const assignLabelToMergeRequest = async (
  idProject: number,
  idMergeRequest: number,
  labels: string[] | string
): Promise<void> => {
  const label = (Array.isArray(labels) ? labels : [labels]).join(',');
  await client.put(`/projects/${idProject}/merge_requests/${idMergeRequest}`, {
    labels: label,
  });
};
