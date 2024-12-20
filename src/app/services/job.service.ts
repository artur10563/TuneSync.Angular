import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class JobService {

    constructor(private http: HttpClient,
                private notificationService: NotificationService) { }

    private baseUrl = environment.apiUrl + "/job";

    async getJobStatus<T>(jobId: string): Promise<JobStatusResponse<T>> {
        try {
            const response = await firstValueFrom(
                this.http.get<{ jobStatus: string, serializedData: string }>(`${this.baseUrl}/${jobId}`)
            );

            const parsedData: T = JSON.parse(response.serializedData);
            return new JobStatusResponse<T>(response.jobStatus, parsedData);

        } catch (err) {
            this.notificationService.handleError(err);
            return new JobStatusResponse<T>("", null as any);
        }
    }
}

export class JobStatusResponse<T> {
    constructor(
        public jobStatus: string,
        public data: T
    ) {}
}