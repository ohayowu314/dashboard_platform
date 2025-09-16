// src/types.tsx
export interface TocItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: TocItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface PageConfig {
  tocItems: TocItem[];
  breadcrumbItems: BreadcrumbItem[];
  rightPanelContent?: React.ReactNode;
  content: React.ReactNode;
}
