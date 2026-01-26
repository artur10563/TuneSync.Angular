import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../core/services/notification.service';
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
                this.http.get<{ jobStatus: string; serializedData?: string }>(`${this.baseUrl}/${jobId}`)
            );

            let parsedData: T | null = null;
            if (response.serializedData) {
                try {
                    parsedData = JSON.parse(response.serializedData);
                } catch (parseError) {
                    console.error("Error parsing job data:", parseError);
                }
            }

            return new JobStatusResponse<T>(response.jobStatus ?? "Unknown", parsedData);
        } catch (err) {
            this.notificationService.handleError(err);
            return new JobStatusResponse<T>("Error", null);
        }
    }
}

export class JobStatusResponse<T> {
    constructor(
        public jobStatus: string,
        public data: T | null = null
    ) { }
}