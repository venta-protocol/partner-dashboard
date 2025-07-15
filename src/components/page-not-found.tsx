import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PageNotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <Card className="flex items-center justify-center h-full p-8 rounded-xl">
          <CardHeader className="text-center">
            <div className="space-y-4">
              <CardTitle>404 - Page Not Found</CardTitle>
              <CardDescription>
                The page you are looking for does not exist.
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default PageNotFound;
