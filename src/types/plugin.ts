// プラグイン関連の型定義
import { ReactNode } from 'react'

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
}

export interface PluginRegistry {
  [pluginId: string]: Plugin;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  entryPoint: string;
  dependencies?: string[];
}



