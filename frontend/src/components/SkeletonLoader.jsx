import { Card, CardBody } from '@heroui/react';

export default function SkeletonLoader({ count = 3, height = 'h-20' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardBody className={`${height} animate-pulse bg-white/5`}></CardBody>
        </Card>
      ))}
    </div>
  );
}