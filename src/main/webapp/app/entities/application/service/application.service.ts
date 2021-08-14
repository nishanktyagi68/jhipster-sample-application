import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplication, getApplicationIdentifier } from '../application.model';

export type EntityResponseType = HttpResponse<IApplication>;
export type EntityArrayResponseType = HttpResponse<IApplication[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/applications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(application: IApplication): Observable<EntityResponseType> {
    return this.http.post<IApplication>(this.resourceUrl, application, { observe: 'response' });
  }

  update(application: IApplication): Observable<EntityResponseType> {
    return this.http.put<IApplication>(`${this.resourceUrl}/${getApplicationIdentifier(application) as number}`, application, {
      observe: 'response',
    });
  }

  partialUpdate(application: IApplication): Observable<EntityResponseType> {
    return this.http.patch<IApplication>(`${this.resourceUrl}/${getApplicationIdentifier(application) as number}`, application, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IApplication>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IApplication[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addApplicationToCollectionIfMissing(
    applicationCollection: IApplication[],
    ...applicationsToCheck: (IApplication | null | undefined)[]
  ): IApplication[] {
    const applications: IApplication[] = applicationsToCheck.filter(isPresent);
    if (applications.length > 0) {
      const applicationCollectionIdentifiers = applicationCollection.map(applicationItem => getApplicationIdentifier(applicationItem)!);
      const applicationsToAdd = applications.filter(applicationItem => {
        const applicationIdentifier = getApplicationIdentifier(applicationItem);
        if (applicationIdentifier == null || applicationCollectionIdentifiers.includes(applicationIdentifier)) {
          return false;
        }
        applicationCollectionIdentifiers.push(applicationIdentifier);
        return true;
      });
      return [...applicationsToAdd, ...applicationCollection];
    }
    return applicationCollection;
  }
}
