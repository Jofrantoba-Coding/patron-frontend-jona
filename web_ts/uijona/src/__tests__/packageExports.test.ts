import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  exports: Record<string, unknown>;
};

describe('package exports', () => {
  it('exposes direct subpath imports for every public component family entry', () => {
    const expectedSubpaths = [
      './atoms/ButtonAtom',
      './atoms/InputAtom',
      './atoms/TextareaAtom',
      './atoms/BadgeAtom',
      './atoms/CheckboxAtom',
      './atoms/RadioAtom',
      './atoms/AvatarAtom',
      './atoms/SelectAtom',
      './atoms/SwitchAtom',
      './atoms/TextAtom',
      './atoms/LabelAtom',
      './atoms/LinkAtom',
      './atoms/IconButtonAtom',
      './atoms/ChipAtom',
      './atoms/ErrorMessageAtom',
      './atoms/SpinnerAtom',
      './atoms/SeparatorAtom',
      './atoms/ProgressAtom',
      './atoms/SkeletonAtom',
      './atoms/ToastAtom',
      './atoms/PanelAtom',
      './molecules/CardMolecule',
      './molecules/AlertMolecule',
      './molecules/FormFieldMolecule',
      './molecules/CheckboxFieldMolecule',
      './molecules/RadioGroupMolecule',
      './molecules/SelectFieldMolecule',
      './molecules/SwitchFieldMolecule',
      './molecules/UserAvatarMolecule',
      './molecules/AccordionMolecule',
      './molecules/EmptyStateMolecule',
      './molecules/DialogMolecule',
      './molecules/TabsMolecule',
      './molecules/DropdownMolecule',
      './molecules/PaginationMolecule',
      './molecules/TooltipMolecule',
      './molecules/TableMolecule',
      './molecules/BreadcrumbMolecule',
      './molecules/DatePickerMolecule',
      './molecules/SkeletonPresets',
      './molecules/SearchInputMolecule',
      './molecules/NumberInputMolecule',
      './molecules/FileUploadMolecule',
      './molecules/StatCardMolecule',
      './molecules/StepperMolecule',
      './molecules/TimerMolecule',
      './layouts/BorderLayout',
      './layouts/FlowLayout',
      './layouts/BoxLayout',
      './layouts/GridLayout',
      './layouts/CardLayout',
      './layouts/GridBagLayout',
      './layouts/GroupLayout',
      './layouts/SpringLayout',
      './layouts/SidebarLayout',
      './organisms/LoginOrganism',
      './organisms/RecoverPasswordOrganism',
      './organisms/CreateAccountOrganism',
      './organisms/ErrorPageOrganism',
      './organisms/HeaderPageOrganism',
      './organisms/FooterPageOrganism',
      './pages/UiHomeLogin',
      './pages/UiHomeRecoverPassword',
      './pages/UiHomeCreateAccount',
      './pages/UiHomeError',
      './hooks/useToast',
      './theme',
      './lib/cn',
    ];

    expectedSubpaths.forEach((subpath) => {
      expect(packageJson.exports).toHaveProperty(subpath);
    });
  });
});
