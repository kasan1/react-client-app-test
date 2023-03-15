export interface INcaLayerResponse {
  code: string;
  responseObject: any;
  message?: string;
  result?: INcaDataResult;
}

interface INcaDataResult {
  version: string;
}
