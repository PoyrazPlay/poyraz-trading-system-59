
import HomeLayout from '@/components/layout/HomeLayout';

const HistTrades = () => {
  return (
    <HomeLayout title="Historical Trades">
      <div className="card-glass rounded-xl p-8 w-full max-w-5xl">
        <p className="text-center text-muted-foreground">
          Historical trading data will appear here.
        </p>
      </div>
    </HomeLayout>
  );
};

export default HistTrades;
