export class CreateProjectDto {
  title: string;
  url: string;
  description?: string;
  cover?: string;
  teamId: number;
}
