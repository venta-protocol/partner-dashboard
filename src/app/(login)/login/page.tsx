import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { LoginPageWrapper } from "@/components/login-page-wrapper";

export default function Login() {
  return (
    <main>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <Card className="p-4">
            <CardHeader className="flex flex-col items-center">
              <Image
                src="/venta_full_logo.png"
                width={100}
                height={100}
                alt="Venta Logo"
                className="mx-auto mb-6" // centers the image horizontally
              />
              <CardTitle className="text-center mb-4">
                Access Partner Dashboard
              </CardTitle>
              {/* <CardDescription className="text-center">Deploy your new project in one-click.</CardDescription> */}
            </CardHeader>
            <CardContent>
              <LoginPageWrapper />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
