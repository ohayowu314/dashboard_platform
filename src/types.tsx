export interface TocItem {
  label: string;
  path: string;
  children?: TocItem[];
}

export interface PageConfig {
  tocItems: TocItem[];
  breadcrumb: string[];
  rightPanel?: React.ReactNode;
  content: React.ReactNode;
}
