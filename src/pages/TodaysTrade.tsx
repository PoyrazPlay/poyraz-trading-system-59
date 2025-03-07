
import HomeLayout from '@/components/layout/HomeLayout';

const TodaysTrade = () => {
  return (
    <HomeLayout title="Today's Trades">
      <div className="card-glass rounded-xl p-8 w-full max-w-5xl">
        <p className="text-center text-muted-foreground">
          Today's trading data will appear here.
        </p>
      </div>
    </HomeLayout>
  );
};

export default TodaysTrade;
