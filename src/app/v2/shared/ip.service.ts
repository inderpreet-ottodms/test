import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class IpService {
  private ipApiUrl = "https://jsonip.com";

  constructor() {}

  async getUserIp(): Promise<{ ip: string | null }> {
    try {
      const response = await fetch(this.ipApiUrl, { mode: "cors" });

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { ip: data.ip };
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return { ip: null };
    }
  }

  async getIp(): Promise<string | null> {
    const result = await this.getUserIp();
    if (result.ip !== null) {
      return result.ip;
    } else {
      console.warn('Failed to fetch IP address');
      return null;
    }
  }
}
