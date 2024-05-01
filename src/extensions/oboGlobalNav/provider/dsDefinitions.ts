export interface IGlobalNavCategory {
    ID: number;
    Title: string;
    Url: string;
    SortOrder: number;
    IconName?: string;
    Restricted: boolean; 
    // "Restricted" is technically not needed for categories, and doesn't "do" anything on them but I'm using
    // it for the click actions on both the categories AND the child items so I can use this
    // interface for both instead of writing 2 functions or complex logic for 2nd level clicks
}

export interface IGlobalNavItem extends IGlobalNavCategory {
    Category: {
        Id: number | null;
        Title: string | null;
    };
    Parent: {
        Id: number | null;
        Title: string | null;
    };
}