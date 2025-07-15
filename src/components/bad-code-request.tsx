import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const BadCodeRequest = ({ text }: { text: string }) => {
  return (
    <main>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md px-4">
          <Card className="flex flex-col items-center p-4">
            <CardHeader className="flex flex-col items-center">
              <Image
                src="/venta_full_logo.png"
                width={100}
                height={100}
                alt="Venta Logo"
                className="mx-auto mb-6"
              />
              <CardTitle className="text-center mb-4 text-red-500">
                Invalid Registration Link
              </CardTitle>
              <p className="text-center text-gray-600">{text}</p>
            </CardHeader>
            <Link href="/">
              <Button>Return to login page</Button>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default BadCodeRequest;
