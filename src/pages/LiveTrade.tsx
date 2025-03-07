
import HomeLayout from '@/components/layout/HomeLayout';

const LiveTrade = () => {
  return (
    <HomeLayout title="Live Trading">
      <div className="card-glass rounded-xl p-8 w-full max-w-5xl">
        <p className="text-center text-muted-foreground">
          Real-time trading data will appear here.
        </p>
      </div>
    </HomeLayout>
  );
};

export default LiveTrade;
