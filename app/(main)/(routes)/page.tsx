import { ModeToggle } from '@/components/mode-toggle';
import { UserButtonProfile } from '@/components/user-button';


const MainPage = () => {
  return (
    <div>
      <UserButtonProfile />
      <ModeToggle />
    </div>
  );
}

export default MainPage;