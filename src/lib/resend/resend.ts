import { Resend } from "resend";

// Initialize the Resend object with the API key from environment variables
export const resend = new Resend(process.env.RESEND_API_KEY as string);
