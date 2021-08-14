export interface IApplication {
  id?: number;
  name?: string | null;
  isActive?: boolean | null;
}

export class Application implements IApplication {
  constructor(public id?: number, public name?: string | null, public isActive?: boolean | null) {
    this.isActive = this.isActive ?? false;
  }
}

export function getApplicationIdentifier(application: IApplication): number | undefined {
  return application.id;
}
