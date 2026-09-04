// アプリID → 本体コンポーネントの表。
// data/apps.ts に1行足したら、ここにも1行足す。この2つが揃って初めてアプリになる。

import type { ComponentType } from 'react'
import CalculatorBody from './CalculatorBody'
import { ContactsBody, FaceTimeBody, InvitesBody, MailBody, MessagesBody, PhoneBody } from './comms'
import {
  AboutBody,
  BlogAppBody,
  BlogListBody,
  FinderBody,
  ProductsBody,
  ProfileBody,
  SettingsBody,
  SocialBody,
  TrashBody,
} from './core'
import { AutomatorBody, GrapherBody, HoldemBody, ScriptEditorBody, XcodeBody } from './dev'
import type { AppBodyProps } from './kit'
import {
  CompassBody,
  FindMyBody,
  FitnessBody,
  HealthBody,
  HomeBody,
  MapsBody,
  StocksBody,
  TranslateBody,
  WalletBody,
  WeatherBody,
} from './life'
import {
  AppStoreBody,
  BooksBody,
  CameraBody,
  ClassicalBody,
  ITunesBody,
  MusicBody,
  PhotosBody,
  PodcastsBody,
  SafariBody,
  ShazamBody,
  StoreBody,
  TvBody,
  VoiceMemosBody,
} from './media'
import NotepadBody from './NotepadBody'
import TerminalBody from './TerminalBody'
import { CalendarBody, ClockBody, RemindersBody } from './time'
import {
  ActivityBody,
  AirportBody,
  BluetoothBody,
  DictionaryBody,
  FontBookBody,
  ImageCaptureBody,
  MagnifierBody,
  PreviewBody,
  QuickTimeBody,
  ScreenShareBody,
  ShortcutsBody,
  SupportBody,
  SysInfoBody,
  TimeMachineBody,
  TipsBody,
} from './utils'
import { FreeformBody, JournalBody, KeynoteBody, NumbersBody, PagesBody, StickiesBody, TextEditBody } from './work'

type Body = ComponentType<AppBodyProps>

const wrap = (Component: ComponentType): Body => {
  const Wrapped = () => <Component />
  Wrapped.displayName = Component.displayName ?? Component.name
  return Wrapped
}

export const appBodies: Record<string, Body> = {
  // 土台
  profile: ProfileBody,
  products: ProductsBody,
  social: wrap(SocialBody),
  trash: wrap(TrashBody),
  about: wrap(AboutBody),
  settings: SettingsBody,
  finder: FinderBody,
  memo: wrap(NotepadBody),
  calc: wrap(CalculatorBody),
  terminal: wrap(TerminalBody),
  // ブログはPCがいちらんウィンドウ、SPがアプリ内ナビと形が違う
  blog: ({ platform }: AppBodyProps) => (platform === 'sp' ? <BlogAppBody /> : <BlogListBody platform="pc" />),
  // 時間
  clock: wrap(ClockBody),
  calendar: wrap(CalendarBody),
  reminders: wrap(RemindersBody),
  // つながり
  messages: wrap(MessagesBody),
  mail: wrap(MailBody),
  facetime: wrap(FaceTimeBody),
  phone: PhoneBody,
  contacts: wrap(ContactsBody),
  invites: InvitesBody,
  // メディア
  safari: SafariBody,
  music: wrap(MusicBody),
  classical: wrap(ClassicalBody),
  podcasts: wrap(PodcastsBody),
  tv: wrap(TvBody),
  books: wrap(BooksBody),
  photos: PhotosBody,
  camera: CameraBody,
  voicememos: wrap(VoiceMemosBody),
  shazam: wrap(ShazamBody),
  appstore: AppStoreBody,
  itunes: wrap(ITunesBody),
  store: wrap(StoreBody),
  // くらし
  weather: wrap(WeatherBody),
  maps: MapsBody,
  compass: wrap(CompassBody),
  health: HealthBody,
  fitness: wrap(FitnessBody),
  home: wrap(HomeBody),
  wallet: wrap(WalletBody),
  translate: wrap(TranslateBody),
  stocks: wrap(StocksBody),
  findmy: FindMyBody,
  // 仕事道具
  numbers: wrap(NumbersBody),
  pages: wrap(PagesBody),
  keynote: wrap(KeynoteBody),
  freeform: wrap(FreeformBody),
  journal: wrap(JournalBody),
  stickies: wrap(StickiesBody),
  textedit: wrap(TextEditBody),
  // ユーティリティ
  magnifier: wrap(MagnifierBody),
  dictionary: wrap(DictionaryBody),
  shortcuts: ShortcutsBody,
  tips: TipsBody,
  support: SupportBody,
  activity: wrap(ActivityBody),
  sysinfo: wrap(SysInfoBody),
  timemachine: wrap(TimeMachineBody),
  screenshare: wrap(ScreenShareBody),
  bluetooth: wrap(BluetoothBody),
  airport: wrap(AirportBody),
  fontbook: wrap(FontBookBody),
  imagecapture: wrap(ImageCaptureBody),
  preview: PreviewBody,
  quicktime: wrap(QuickTimeBody),
  // 開発・あそび
  automator: wrap(AutomatorBody),
  scripteditor: wrap(ScriptEditorBody),
  xcode: XcodeBody,
  grapher: wrap(GrapherBody),
  holdem: wrap(HoldemBody),
}

export type { AppBodyProps }
