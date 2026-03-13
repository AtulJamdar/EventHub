import { Card, CardBody } from '@heroui/react';

export default function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Reports</h1>
        <p className="text-gray-400">Generate and view detailed reports</p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-8">
          <p className="text-gray-300 text-center py-20">Reports page coming soon...</p>
        </CardBody>
      </Card>
    </div>
  );
}