import axios from 'axios';

export const hexToRgb = (input: string): string => {
  input = input + '';
  input = input.replace('#', '');
  let hexRegex = /[0-9A-Fa-f]/g;
  if (!hexRegex.test(input) || (input.length !== 3 && input.length !== 6)) {
    throw new Error('input is not a valid hex color.');
  }

  if (input.length === 3) {
    let first = input[0];
    let second = input[1];
    let third = input[2];
    input = first + first + second + second + third + third;
  }

  input = input.toUpperCase();
  let first = input[0] + input[1];
  let second = input[2] + input[3];
  let third = input[4] + input[5];

  return `${parseInt(first, 16)}, ${parseInt(second, 16)}, ${parseInt(
    third,
    16,
  )}`;
};

export const splitString = (label: string) => {
  if (/\s/.test(label)) {
    return label.split(/[\s-]+/);
  } else {
    return [label];
  }
};

export const getQueryParams = (search: string) => {
  const params = [];
  if (search.length === 0) return [];

  const paramsArray = search.slice(1).split('&');
  for (let i = 0; i < paramsArray.length; i++) {
    const keyValuePair = paramsArray[i].split('=');
    params.push({ key: keyValuePair[0], value: keyValuePair[1] });
  }

  return params;
};

export const downloadBlob = (
  url: string,
  filename: string,
  setLoading: (state: boolean) => void,
) => {
  if (!url) {
    throw new Error('Resource URL not provided! You need to provide one');
  }
  setLoading(true);

  axios
    .get('/file/download', {
      params: {
        url,
        filename,
      },
      responseType: 'arraybuffer',
    })
    .then((response) => {
      createDownloadLink(response, filename);
    })
    .catch((err) => console.log(err))
    .finally(() => setLoading(false));
};

export const createDownloadLink = (response: any, filename: string) => {
  console.log(response, filename);

  var blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });

  if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
    (window.navigator as any).msSaveOrOpenBlob(blob);
    return;
  }

  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;

  if (filename && filename.length) a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const normalize = (val: number, min: number, max: number) =>
  (val - min) / (max - min);

export const toCapitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const getFilename = (response: any) =>
  response.headers['content-disposition'].split('filename=')[1].split(';')[0];
