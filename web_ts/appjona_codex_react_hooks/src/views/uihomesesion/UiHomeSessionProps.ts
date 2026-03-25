export interface UiHomeSessionProps {
  name: string;
  email: string;
  handlerLogout: () => void;
  handlerGoToPublicHome: () => void;
}
