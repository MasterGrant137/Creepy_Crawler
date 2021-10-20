# Redux State Shape

### session
```json
session: {
    user: {
        email: string,
        id: integer,
        username: string
        created_at: timestamp,
        updated_at: timestamp
    }
}

themes: {
    "1": {
        id: integer,
        user_id: integer,
        active: boolean,
        background_color: string,
        background_image: string,
        font_color: string,
        font_family: string,
        font_size: integer,
    }
    ...
    "5": {
        id: integer,
        user_id: integer,
        active: boolean,
        background_color: string,
        background_image: string,
        font_color: string,
        font_family: string,
        font_size: integer,
    }
}

history: {
    id: string,
    user_id: integer,
    search: string,
    visit: string,
    created_at: timestamp,
    updated_at: timestamp
}
```

# React Data Flow
![React Data Flow](/images/react_data_flow.jpg)
