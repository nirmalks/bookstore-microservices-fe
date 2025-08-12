export type SingleIdParams = {
  id: string;
};

export type QueryParams = {
  [k: string]: string
}

export type ParamsWithId = {
  params: {
    id?: string
  }
}