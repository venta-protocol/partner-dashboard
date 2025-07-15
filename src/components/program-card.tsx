import React from "react";
import Link from "next/link";
import { Title, Text, Card, Flex } from "@tremor/react";

const ProgramCard = ({
  program,
  status,
}: {
  program: { id: string; name: string; description: string; isLive: boolean };
  status: "enabled" | "available";
}) => {
  const isComingSoon = !program.isLive;

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        <Title className="text-gray-800">{program.name}</Title>
        <Text className="text-gray-600 mt-2">{program.description}</Text>
      </div>

      <Flex className="justify-between items-center mt-6">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isComingSoon
              ? "bg-gray-200 text-gray-600"
              : status === "enabled"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isComingSoon
            ? "Coming Soon"
            : status === "enabled"
            ? "Enabled"
            : "Available"}
        </span>

        {isComingSoon ? (
          <span className="text-gray-400 text-sm font-semibold">Soon</span>
        ) : (
          <Link
            href={`/loyalty/${program.id}`}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            View Details
          </Link>
        )}
      </Flex>
    </Card>
  );
};

export default ProgramCard;
