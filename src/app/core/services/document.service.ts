import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/documents`;

  generateDocument(templateName: string, data: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generate`, 
      { templateName, data },
      { responseType: 'blob' }
    );
  }

  uploadDocument(file: File, metadata: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${documentId}/download`, 
      { responseType: 'blob' }
    );
  }
}