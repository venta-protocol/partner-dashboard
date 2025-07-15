import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AccessDeny = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <Card className="flex items-center justify-center h-full p-8 rounded-xl">
          <CardHeader className="text-center">
            <div className="space-y-4">
              <CardTitle>Access Deny</CardTitle>
              <CardDescription>Contact Support</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AccessDeny;
