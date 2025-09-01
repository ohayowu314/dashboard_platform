## Gemini 提問 
> 另開新一頁

【專案背景】
- 技術：Vite + React + MUI + Zustand + TypeScript
- 類型：資料視覺化儀表板
- 架構：
  src/
  ├── components/layout/Sidebar.tsx, TopNav.tsx, RightPanel.tsx, Layout.tsx, PageWrapper.tsx
  ├── context/LayoutContext.tsx, LayoutProvider.tsx, useLayoutContext.tsx
  ├── pages/UploadPage.tsx, ChartConfigPage.tsx, DashboardPage.tsx, DownloadPage.tsx, TestingPage.tsx
  ├── routes/tocMap.ts
  ├── stores/layoutStore.ts
  ├── types.ts
  ├── utils.ts
  └── App.tsx

【當前狀態】
大區塊的頁面布局已經完成，包含 4 個區塊，分別是 Sidebar, TopNav, RightPanel 和主內容區。

【目前問題或需求】
我需要一個顯示資料表格的元件，輸入如下 json 格式資料：

```json
[
    {
        "year": 2020,
        "month": 1,
        "value": 100
    },
    {
        "year": 2020,
        "month": 2,
        "value": 150
    },
    {
        "year": 2020,
        "month": 3,
        "value": 200
    }
]
```

在畫面上顯示如下圖：

| year | month | value |
| ---- | ----- | ----- |
| 2020 | 1     | 100   |
| 2020 | 2     | 150   |
| 2020 | 3     | 200   |


## Gemini 回答 

好的，這是一個很常見的需求。基於您提供的專案背景，我將使用 Material-UI 來建立一個可重複使用的 `DataTable` 元件，並在一個測試頁面中展示如何使用它。

這是我為您準備的程式碼變更：

### 1. 建立資料表格元件
我將在 `src/components/` 目錄下建立一個新的 `DataTable.tsx` 檔案。這個元件是通用的，可以接受任何物件陣列並將其呈現為表格。

```tsx
// src/components/DataTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

interface DataTableProps<T extends object> {
  data: T[];
}

const DataTable = <T extends object>({ data }: DataTableProps<T>): React.ReactElement | null => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ padding: 2 }}>
        <Typography>No data to display.</Typography>
      </Paper>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {headers.map((header) => (
                <TableCell key={`${rowIndex}-${header}`}>
                  {String(row[header as keyof T])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
```

**程式碼說明：**
- **通用性：**此元件使用泛型 `<T extends object>`，使其可以接受任何結構的物件陣列。
- **動態欄位：**它會自動從資料陣列的第一個物件中讀取 keys 作為表格的標頭 (headers)，因此您不需要手動定義欄位。
- **MUI 元件：**使用 @mui/material 中的 `TableContainer`, `Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell` 和 `Paper` 來建構符合您專案風格的表格。
- **無資料處理：**如果傳入的 `data` 是空的或不存在，它會顯示一則「No data to display.」的訊息，而不是顯示一個空的表格或報錯。

### 2. 建立測試頁面以展示 DataTable
為了方便您測試和查看效果，我將在 `src/pages/` 目錄下建立一個 `TestingPage.tsx` 檔案，並在其中使用您提供的範例資料來渲染 `DataTable` 元件。

```tsx
// src/pages/TestingPage.tsx
import React from 'react';
import DataTable from '../components/DataTable';
import { Box, Typography } from '@mui/material';

const sampleData = [
  {
    year: 2020,
    month: 1,
    value: 100,
  },
  {
    year: 2020,
    month: 2,
    value: 150,
  },
  {
    year: 2020,
    month: 3,
    value: 200,
  },
];

const TestingPage: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Table
      </Typography>
      <DataTable data={sampleData} />
    </Box>
  );
};

export default TestingPage;
```

**程式碼說明：**
- **範例資料：**我直接使用了您在問題中提供的 JSON 資料。
- **元件使用：**此頁面匯入了 `DataTable` 元件，並將範例資料作為 data prop 傳入，非常直觀。
- **頁面排版：**使用 MUI 的 `Box` 和 `Typography` 進行了簡單的排版，讓頁面看起來更整潔。

### 3.後續步驟
為了讓 `TestingPage` 能夠顯示，您需要將它加入到您的路由設定中。根據您的專案架構，您可能需要在 `App.tsx` 或 `routes/tocMap.ts` 檔案中進行設定。

希望這個 `DataTable` 元件能符合您的需求！

## ChatGPT 提問 
## ChatGPT 回答 
## ChatGPT 提問 
## ChatGPT 回答 
## ChatGPT 提問 
## ChatGPT 回答 
## ChatGPT 提問 
## ChatGPT 回答 