// define a type for the equipment menu
export type EquipmentMenu = {
    id: string;
    title: string;
    icon: string;
    link: string;
};

// define props for the EquipmentItem component
export type EquipmentMenuProps = {
  equipmentMenu: EquipmentMenu;
};
