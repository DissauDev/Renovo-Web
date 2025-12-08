export interface ApiErrorShape {
  status: number;
  message: string;
}

// Este es el tipo estándar que devuelve nuestro axiosBaseQuery en caso de error
export interface ApiError {
  error: ApiErrorShape;
}
