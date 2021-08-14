export interface IApplication {
  id?: number;
  name?: string | null;
  active?: boolean | null;
}

export class Application implements IApplication {
  constructor(public id?: number, public name?: string | null, public active?: boolean | null) {
    this.active = this.active ?? false;
  }
}

export function getApplicationIdentifier(application: IApplication): number | undefined {
  return application.id;
}
