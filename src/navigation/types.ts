export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  App: undefined;
};

export type HomeStackParamList = {
  HomeGate: undefined;
  CreateHome: undefined;
  JoinHome: undefined;
};

export type AppDrawerParamList = {
  Hogar: undefined;
  Habitaciones: undefined;
  Editor: undefined;
  Usuarios: undefined;
  Perfil: undefined;
};

export type HabitacionesStackParamList = {
  Rooms: undefined;
  RoomItems: { roomId: string; roomName: string };
  Report: undefined;
};

export type EditorStackParamList = {
  EditorEntry: undefined;
  EditorRooms: undefined;
  EditorRoomItems: { roomId: string; roomName: string };
};
