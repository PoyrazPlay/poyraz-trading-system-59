
import HomeLayout from '@/components/layout/HomeLayout';

const OISummary = () => {
  return (
    <HomeLayout title="Open Interest Summary">
      <div className="card-glass rounded-xl p-8 w-full max-w-5xl">
        <p className="text-center text-muted-foreground">
          Open interest summary data will appear here.
        </p>
      </div>
    </HomeLayout>
  );
};

export default OISummary;
