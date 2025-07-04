import { httpClient } from "../../../shared/api/httpClient";

export interface RegisterRequestDto {
  username: string;
  password: string;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
}

export const authRegister = (dto: RegisterRequestDto) : Promise<void> =>
  httpClient.post('/auth/register', dto).then(r => r.data);

export const authLogin = (dto: LoginRequestDto): Promise<LoginResponseDto> =>
  httpClient.post('/auth/login', dto).then(r => r.data);