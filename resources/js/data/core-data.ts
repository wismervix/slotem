interface MetaData {
    name: string;
    description: string;
    requestFramePermissions: [];
    majorCapabilities: [string];
};

export const META_DATA: MetaData ={
  "name": "Slotem Admin Suite",
  "description": "A booking, staff, and schedule administration dashboard for dental clinics.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}
