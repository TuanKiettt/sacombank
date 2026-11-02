import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

export type UniversityOption = {
  name: string;
  province?: string;
};

export const universityOptions: UniversityOption[] = [];

const normalizeSchoolName = (value: string) =>
  value.replace(/\s+/g, " ").trim();

const titleCaseAfterSpace = (value: string) =>
  value
    .split(" ")
    .map((part) => {
      if (!part) return part;
      const lower = part.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");

const getUniversityDisplayValue = (option: UniversityOption) =>
  option.province ? `${option.name} - ${titleCaseAfterSpace(option.province)}` : option.name;

const parseUniversitySheet = (sheet: XLSX.WorkSheet): UniversityOption[] => {
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
    raw: false,
  });

  const uniqueNames = new Set<string>();

  return rows
    .map((row): UniversityOption | null => {
      const rawProvince =
        row["TỈNH THÀNH"] ??
        row["TINH THANH"] ??
        row["Tỉnh thành"] ??
        row["Tinh thanh"] ??
        "";

      const rawName =
        row["TÊN TRƯỜNG"] ??
        row["TEN TRUONG"] ??
        row["Tên trường"] ??
        row["Tên trường đại học"] ??
        row["name"] ??
        row["school"] ??
        "";

      const province = titleCaseAfterSpace(normalizeSchoolName(String(rawProvince)));
      const name = normalizeSchoolName(String(rawName));
      const key = `${name}::${province}`.toLowerCase();

      if (!name || uniqueNames.has(key)) {
        return null;
      }

      uniqueNames.add(key);
      return {
        name,
        province: province || undefined,
      };
    })
    .filter((item): item is UniversityOption => item !== null);
};

export async function loadUniversityOptions(): Promise<UniversityOption[]> {
  try {
    const response = await fetch("/doc/DS CÁC TRƯỜNG ĐẠI HỌC TOÀN QUỐC.xlsx", {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    const csvList = parseUniversitySheet(firstSheet);
    return csvList;
  } catch (error) {
    console.error("Không thể đọc danh sách trường từ Excel:", error);
    return [];
  }
}

type UniversitySearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const UniversitySearchField = ({
  value,
  onChange,
}: UniversitySearchFieldProps) => {
  const [options, setOptions] = useState<UniversityOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    void loadUniversityOptions().then((data) => {
      if (isMounted) {
        setOptions(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredOptions = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return options.slice(0, 50);
    }

    return options
      .filter((option) => {
        const searchText = `${option.name} ${option.province ?? ""}`.toLowerCase();
        return searchText.includes(query);
      })
      .slice(0, 50);
  }, [options, value]);

  return (
    <>
      <input
        list="university-options-list"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm kiếm hoặc nhập tên trường..."
        className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none border border-blue-200 focus:border-blue-500 shadow-inner"
      />

      <datalist id="university-options-list">
        {filteredOptions.map((option) => (
          <option key={`${option.name}-${option.province ?? ""}`} value={getUniversityDisplayValue(option)} />
        ))}
      </datalist>
    </>
  );
};
