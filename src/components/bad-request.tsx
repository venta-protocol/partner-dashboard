import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const BadRequest = () => {
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
                Invalid Request
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default BadRequest;
