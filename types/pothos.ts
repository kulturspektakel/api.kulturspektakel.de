/* eslint-disable */
import type { Prisma, Viewer, Area, AreaOpeningHour, Page, ProductList, Product, ProductAdditives, Device, Order, OrderItem, CardTransaction, CrewCard, DeviceLog, BandApplication, BandApplicationTag, BandApplicationRating, BandApplicationComment, Event, BandPlaying, Nonce, NonceRequest, GmailReminders, DevicePrivilegeToken, DeviceConfigVersion, News, TwoFactor, ItemLocation, ViewerLocation, ShortDomainRedirect, Donation } from "./prisma/client.js";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    Viewer: {
        Name: "Viewer";
        Shape: Viewer;
        Include: Prisma.ViewerInclude;
        Select: Prisma.ViewerSelect;
        OrderBy: Prisma.ViewerOrderByWithRelationInput;
        WhereUnique: Prisma.ViewerWhereUniqueInput;
        Where: Prisma.ViewerWhereInput;
        Create: {};
        Update: {};
        RelationName: "BandApplication" | "BandApplicationComment" | "BandApplicationRating" | "Nonce" | "ViewerLocation" | "NonceRequest" | "BandApplicationTag" | "CrewCard";
        ListRelations: "BandApplication" | "BandApplicationComment" | "BandApplicationRating" | "Nonce" | "ViewerLocation" | "NonceRequest" | "BandApplicationTag" | "CrewCard";
        Relations: {
            BandApplication: {
                Shape: BandApplication[];
                Name: "BandApplication";
                Nullable: false;
            };
            BandApplicationComment: {
                Shape: BandApplicationComment[];
                Name: "BandApplicationComment";
                Nullable: false;
            };
            BandApplicationRating: {
                Shape: BandApplicationRating[];
                Name: "BandApplicationRating";
                Nullable: false;
            };
            Nonce: {
                Shape: Nonce[];
                Name: "Nonce";
                Nullable: false;
            };
            ViewerLocation: {
                Shape: ViewerLocation[];
                Name: "ViewerLocation";
                Nullable: false;
            };
            NonceRequest: {
                Shape: NonceRequest[];
                Name: "NonceRequest";
                Nullable: false;
            };
            BandApplicationTag: {
                Shape: BandApplicationTag[];
                Name: "BandApplicationTag";
                Nullable: false;
            };
            CrewCard: {
                Shape: CrewCard[];
                Name: "CrewCard";
                Nullable: false;
            };
        };
    };
    Area: {
        Name: "Area";
        Shape: Area;
        Include: Prisma.AreaInclude;
        Select: Prisma.AreaSelect;
        OrderBy: Prisma.AreaOrderByWithRelationInput;
        WhereUnique: Prisma.AreaWhereUniqueInput;
        Where: Prisma.AreaWhereInput;
        Create: {};
        Update: {};
        RelationName: "areaOpeningHour" | "BandPlaying";
        ListRelations: "areaOpeningHour" | "BandPlaying";
        Relations: {
            areaOpeningHour: {
                Shape: AreaOpeningHour[];
                Name: "AreaOpeningHour";
                Nullable: false;
            };
            BandPlaying: {
                Shape: BandPlaying[];
                Name: "BandPlaying";
                Nullable: false;
            };
        };
    };
    AreaOpeningHour: {
        Name: "AreaOpeningHour";
        Shape: AreaOpeningHour;
        Include: Prisma.AreaOpeningHourInclude;
        Select: Prisma.AreaOpeningHourSelect;
        OrderBy: Prisma.AreaOpeningHourOrderByWithRelationInput;
        WhereUnique: Prisma.AreaOpeningHourWhereUniqueInput;
        Where: Prisma.AreaOpeningHourWhereInput;
        Create: {};
        Update: {};
        RelationName: "area";
        ListRelations: never;
        Relations: {
            area: {
                Shape: Area;
                Name: "Area";
                Nullable: false;
            };
        };
    };
    Page: {
        Name: "Page";
        Shape: Page;
        Include: never;
        Select: Prisma.PageSelect;
        OrderBy: Prisma.PageOrderByWithRelationInput;
        WhereUnique: Prisma.PageWhereUniqueInput;
        Where: Prisma.PageWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    ProductList: {
        Name: "ProductList";
        Shape: ProductList;
        Include: Prisma.ProductListInclude;
        Select: Prisma.ProductListSelect;
        OrderBy: Prisma.ProductListOrderByWithRelationInput;
        WhereUnique: Prisma.ProductListWhereUniqueInput;
        Where: Prisma.ProductListWhereInput;
        Create: {};
        Update: {};
        RelationName: "Device" | "OrderItem" | "product";
        ListRelations: "Device" | "OrderItem" | "product";
        Relations: {
            Device: {
                Shape: Device[];
                Name: "Device";
                Nullable: false;
            };
            OrderItem: {
                Shape: OrderItem[];
                Name: "OrderItem";
                Nullable: false;
            };
            product: {
                Shape: Product[];
                Name: "Product";
                Nullable: false;
            };
        };
    };
    Product: {
        Name: "Product";
        Shape: Product;
        Include: Prisma.ProductInclude;
        Select: Prisma.ProductSelect;
        OrderBy: Prisma.ProductOrderByWithRelationInput;
        WhereUnique: Prisma.ProductWhereUniqueInput;
        Where: Prisma.ProductWhereInput;
        Create: {};
        Update: {};
        RelationName: "productList" | "additives";
        ListRelations: "additives";
        Relations: {
            productList: {
                Shape: ProductList;
                Name: "ProductList";
                Nullable: false;
            };
            additives: {
                Shape: ProductAdditives[];
                Name: "ProductAdditives";
                Nullable: false;
            };
        };
    };
    ProductAdditives: {
        Name: "ProductAdditives";
        Shape: ProductAdditives;
        Include: Prisma.ProductAdditivesInclude;
        Select: Prisma.ProductAdditivesSelect;
        OrderBy: Prisma.ProductAdditivesOrderByWithRelationInput;
        WhereUnique: Prisma.ProductAdditivesWhereUniqueInput;
        Where: Prisma.ProductAdditivesWhereInput;
        Create: {};
        Update: {};
        RelationName: "Product";
        ListRelations: "Product";
        Relations: {
            Product: {
                Shape: Product[];
                Name: "Product";
                Nullable: false;
            };
        };
    };
    Device: {
        Name: "Device";
        Shape: Device;
        Include: Prisma.DeviceInclude;
        Select: Prisma.DeviceSelect;
        OrderBy: Prisma.DeviceOrderByWithRelationInput;
        WhereUnique: Prisma.DeviceWhereUniqueInput;
        Where: Prisma.DeviceWhereInput;
        Create: {};
        Update: {};
        RelationName: "productList" | "Order" | "DeviceLog";
        ListRelations: "Order" | "DeviceLog";
        Relations: {
            productList: {
                Shape: ProductList | null;
                Name: "ProductList";
                Nullable: true;
            };
            Order: {
                Shape: Order[];
                Name: "Order";
                Nullable: false;
            };
            DeviceLog: {
                Shape: DeviceLog[];
                Name: "DeviceLog";
                Nullable: false;
            };
        };
    };
    Order: {
        Name: "Order";
        Shape: Order;
        Include: Prisma.OrderInclude;
        Select: Prisma.OrderSelect;
        OrderBy: Prisma.OrderOrderByWithRelationInput;
        WhereUnique: Prisma.OrderWhereUniqueInput;
        Where: Prisma.OrderWhereInput;
        Create: {};
        Update: {};
        RelationName: "device" | "items" | "CardTransaction" | "crewCard";
        ListRelations: "items" | "CardTransaction";
        Relations: {
            device: {
                Shape: Device | null;
                Name: "Device";
                Nullable: true;
            };
            items: {
                Shape: OrderItem[];
                Name: "OrderItem";
                Nullable: false;
            };
            CardTransaction: {
                Shape: CardTransaction[];
                Name: "CardTransaction";
                Nullable: false;
            };
            crewCard: {
                Shape: CrewCard | null;
                Name: "CrewCard";
                Nullable: true;
            };
        };
    };
    OrderItem: {
        Name: "OrderItem";
        Shape: OrderItem;
        Include: Prisma.OrderItemInclude;
        Select: Prisma.OrderItemSelect;
        OrderBy: Prisma.OrderItemOrderByWithRelationInput;
        WhereUnique: Prisma.OrderItemWhereUniqueInput;
        Where: Prisma.OrderItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "order" | "productList";
        ListRelations: never;
        Relations: {
            order: {
                Shape: Order;
                Name: "Order";
                Nullable: false;
            };
            productList: {
                Shape: ProductList | null;
                Name: "ProductList";
                Nullable: true;
            };
        };
    };
    CardTransaction: {
        Name: "CardTransaction";
        Shape: CardTransaction;
        Include: Prisma.CardTransactionInclude;
        Select: Prisma.CardTransactionSelect;
        OrderBy: Prisma.CardTransactionOrderByWithRelationInput;
        WhereUnique: Prisma.CardTransactionWhereUniqueInput;
        Where: Prisma.CardTransactionWhereInput;
        Create: {};
        Update: {};
        RelationName: "deviceLog" | "Order";
        ListRelations: never;
        Relations: {
            deviceLog: {
                Shape: DeviceLog;
                Name: "DeviceLog";
                Nullable: false;
            };
            Order: {
                Shape: Order | null;
                Name: "Order";
                Nullable: true;
            };
        };
    };
    CrewCard: {
        Name: "CrewCard";
        Shape: CrewCard;
        Include: Prisma.CrewCardInclude;
        Select: Prisma.CrewCardSelect;
        OrderBy: Prisma.CrewCardOrderByWithRelationInput;
        WhereUnique: Prisma.CrewCardWhereUniqueInput;
        Where: Prisma.CrewCardWhereInput;
        Create: {};
        Update: {};
        RelationName: "viewer" | "Order";
        ListRelations: "Order";
        Relations: {
            viewer: {
                Shape: Viewer | null;
                Name: "Viewer";
                Nullable: true;
            };
            Order: {
                Shape: Order[];
                Name: "Order";
                Nullable: false;
            };
        };
    };
    DeviceLog: {
        Name: "DeviceLog";
        Shape: DeviceLog;
        Include: Prisma.DeviceLogInclude;
        Select: Prisma.DeviceLogSelect;
        OrderBy: Prisma.DeviceLogOrderByWithRelationInput;
        WhereUnique: Prisma.DeviceLogWhereUniqueInput;
        Where: Prisma.DeviceLogWhereInput;
        Create: {};
        Update: {};
        RelationName: "device" | "CardTransaction";
        ListRelations: "CardTransaction";
        Relations: {
            device: {
                Shape: Device;
                Name: "Device";
                Nullable: false;
            };
            CardTransaction: {
                Shape: CardTransaction[];
                Name: "CardTransaction";
                Nullable: false;
            };
        };
    };
    BandApplication: {
        Name: "BandApplication";
        Shape: BandApplication;
        Include: Prisma.BandApplicationInclude;
        Select: Prisma.BandApplicationSelect;
        OrderBy: Prisma.BandApplicationOrderByWithRelationInput;
        WhereUnique: Prisma.BandApplicationWhereUniqueInput;
        Where: Prisma.BandApplicationWhereInput;
        Create: {};
        Update: {};
        RelationName: "contactedByViewer" | "event" | "bandApplicationComment" | "bandApplicationRating" | "BandApplicationTag";
        ListRelations: "bandApplicationComment" | "bandApplicationRating" | "BandApplicationTag";
        Relations: {
            contactedByViewer: {
                Shape: Viewer | null;
                Name: "Viewer";
                Nullable: true;
            };
            event: {
                Shape: Event;
                Name: "Event";
                Nullable: false;
            };
            bandApplicationComment: {
                Shape: BandApplicationComment[];
                Name: "BandApplicationComment";
                Nullable: false;
            };
            bandApplicationRating: {
                Shape: BandApplicationRating[];
                Name: "BandApplicationRating";
                Nullable: false;
            };
            BandApplicationTag: {
                Shape: BandApplicationTag[];
                Name: "BandApplicationTag";
                Nullable: false;
            };
        };
    };
    BandApplicationTag: {
        Name: "BandApplicationTag";
        Shape: BandApplicationTag;
        Include: Prisma.BandApplicationTagInclude;
        Select: Prisma.BandApplicationTagSelect;
        OrderBy: Prisma.BandApplicationTagOrderByWithRelationInput;
        WhereUnique: Prisma.BandApplicationTagWhereUniqueInput;
        Where: Prisma.BandApplicationTagWhereInput;
        Create: {};
        Update: {};
        RelationName: "bandApplication" | "createdByViewer";
        ListRelations: never;
        Relations: {
            bandApplication: {
                Shape: BandApplication;
                Name: "BandApplication";
                Nullable: false;
            };
            createdByViewer: {
                Shape: Viewer;
                Name: "Viewer";
                Nullable: false;
            };
        };
    };
    BandApplicationRating: {
        Name: "BandApplicationRating";
        Shape: BandApplicationRating;
        Include: Prisma.BandApplicationRatingInclude;
        Select: Prisma.BandApplicationRatingSelect;
        OrderBy: Prisma.BandApplicationRatingOrderByWithRelationInput;
        WhereUnique: Prisma.BandApplicationRatingWhereUniqueInput;
        Where: Prisma.BandApplicationRatingWhereInput;
        Create: {};
        Update: {};
        RelationName: "bandApplication" | "viewer";
        ListRelations: never;
        Relations: {
            bandApplication: {
                Shape: BandApplication;
                Name: "BandApplication";
                Nullable: false;
            };
            viewer: {
                Shape: Viewer;
                Name: "Viewer";
                Nullable: false;
            };
        };
    };
    BandApplicationComment: {
        Name: "BandApplicationComment";
        Shape: BandApplicationComment;
        Include: Prisma.BandApplicationCommentInclude;
        Select: Prisma.BandApplicationCommentSelect;
        OrderBy: Prisma.BandApplicationCommentOrderByWithRelationInput;
        WhereUnique: Prisma.BandApplicationCommentWhereUniqueInput;
        Where: Prisma.BandApplicationCommentWhereInput;
        Create: {};
        Update: {};
        RelationName: "bandApplication" | "viewer";
        ListRelations: never;
        Relations: {
            bandApplication: {
                Shape: BandApplication;
                Name: "BandApplication";
                Nullable: false;
            };
            viewer: {
                Shape: Viewer;
                Name: "Viewer";
                Nullable: false;
            };
        };
    };
    Event: {
        Name: "Event";
        Shape: Event;
        Include: Prisma.EventInclude;
        Select: Prisma.EventSelect;
        OrderBy: Prisma.EventOrderByWithRelationInput;
        WhereUnique: Prisma.EventWhereUniqueInput;
        Where: Prisma.EventWhereInput;
        Create: {};
        Update: {};
        RelationName: "bandApplication" | "BandPlaying";
        ListRelations: "bandApplication" | "BandPlaying";
        Relations: {
            bandApplication: {
                Shape: BandApplication[];
                Name: "BandApplication";
                Nullable: false;
            };
            BandPlaying: {
                Shape: BandPlaying[];
                Name: "BandPlaying";
                Nullable: false;
            };
        };
    };
    BandPlaying: {
        Name: "BandPlaying";
        Shape: BandPlaying;
        Include: Prisma.BandPlayingInclude;
        Select: Prisma.BandPlayingSelect;
        OrderBy: Prisma.BandPlayingOrderByWithRelationInput;
        WhereUnique: Prisma.BandPlayingWhereUniqueInput;
        Where: Prisma.BandPlayingWhereInput;
        Create: {};
        Update: {};
        RelationName: "area" | "event";
        ListRelations: never;
        Relations: {
            area: {
                Shape: Area;
                Name: "Area";
                Nullable: false;
            };
            event: {
                Shape: Event;
                Name: "Event";
                Nullable: false;
            };
        };
    };
    Nonce: {
        Name: "Nonce";
        Shape: Nonce;
        Include: Prisma.NonceInclude;
        Select: Prisma.NonceSelect;
        OrderBy: Prisma.NonceOrderByWithRelationInput;
        WhereUnique: Prisma.NonceWhereUniqueInput;
        Where: Prisma.NonceWhereInput;
        Create: {};
        Update: {};
        RelationName: "createdFor";
        ListRelations: never;
        Relations: {
            createdFor: {
                Shape: Viewer | null;
                Name: "Viewer";
                Nullable: true;
            };
        };
    };
    NonceRequest: {
        Name: "NonceRequest";
        Shape: NonceRequest;
        Include: Prisma.NonceRequestInclude;
        Select: Prisma.NonceRequestSelect;
        OrderBy: Prisma.NonceRequestOrderByWithRelationInput;
        WhereUnique: Prisma.NonceRequestWhereUniqueInput;
        Where: Prisma.NonceRequestWhereInput;
        Create: {};
        Update: {};
        RelationName: "createdFor";
        ListRelations: never;
        Relations: {
            createdFor: {
                Shape: Viewer | null;
                Name: "Viewer";
                Nullable: true;
            };
        };
    };
    GmailReminders: {
        Name: "GmailReminders";
        Shape: GmailReminders;
        Include: never;
        Select: Prisma.GmailRemindersSelect;
        OrderBy: Prisma.GmailRemindersOrderByWithRelationInput;
        WhereUnique: Prisma.GmailRemindersWhereUniqueInput;
        Where: Prisma.GmailRemindersWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    DevicePrivilegeToken: {
        Name: "DevicePrivilegeToken";
        Shape: DevicePrivilegeToken;
        Include: never;
        Select: Prisma.DevicePrivilegeTokenSelect;
        OrderBy: Prisma.DevicePrivilegeTokenOrderByWithRelationInput;
        WhereUnique: Prisma.DevicePrivilegeTokenWhereUniqueInput;
        Where: Prisma.DevicePrivilegeTokenWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    DeviceConfigVersion: {
        Name: "DeviceConfigVersion";
        Shape: DeviceConfigVersion;
        Include: never;
        Select: Prisma.DeviceConfigVersionSelect;
        OrderBy: Prisma.DeviceConfigVersionOrderByWithRelationInput;
        WhereUnique: Prisma.DeviceConfigVersionWhereUniqueInput;
        Where: Prisma.DeviceConfigVersionWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    News: {
        Name: "News";
        Shape: News;
        Include: never;
        Select: Prisma.NewsSelect;
        OrderBy: Prisma.NewsOrderByWithRelationInput;
        WhereUnique: Prisma.NewsWhereUniqueInput;
        Where: Prisma.NewsWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    TwoFactor: {
        Name: "TwoFactor";
        Shape: TwoFactor;
        Include: never;
        Select: Prisma.TwoFactorSelect;
        OrderBy: Prisma.TwoFactorOrderByWithRelationInput;
        WhereUnique: Prisma.TwoFactorWhereUniqueInput;
        Where: Prisma.TwoFactorWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    ItemLocation: {
        Name: "ItemLocation";
        Shape: ItemLocation;
        Include: never;
        Select: Prisma.ItemLocationSelect;
        OrderBy: Prisma.ItemLocationOrderByWithRelationInput;
        WhereUnique: Prisma.ItemLocationWhereUniqueInput;
        Where: Prisma.ItemLocationWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    ViewerLocation: {
        Name: "ViewerLocation";
        Shape: ViewerLocation;
        Include: Prisma.ViewerLocationInclude;
        Select: Prisma.ViewerLocationSelect;
        OrderBy: Prisma.ViewerLocationOrderByWithRelationInput;
        WhereUnique: Prisma.ViewerLocationWhereUniqueInput;
        Where: Prisma.ViewerLocationWhereInput;
        Create: {};
        Update: {};
        RelationName: "viewer";
        ListRelations: never;
        Relations: {
            viewer: {
                Shape: Viewer;
                Name: "Viewer";
                Nullable: false;
            };
        };
    };
    ShortDomainRedirect: {
        Name: "ShortDomainRedirect";
        Shape: ShortDomainRedirect;
        Include: never;
        Select: Prisma.ShortDomainRedirectSelect;
        OrderBy: Prisma.ShortDomainRedirectOrderByWithRelationInput;
        WhereUnique: Prisma.ShortDomainRedirectWhereUniqueInput;
        Where: Prisma.ShortDomainRedirectWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Donation: {
        Name: "Donation";
        Shape: Donation;
        Include: never;
        Select: Prisma.DonationSelect;
        OrderBy: Prisma.DonationOrderByWithRelationInput;
        WhereUnique: Prisma.DonationWhereUniqueInput;
        Where: Prisma.DonationWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
}
export function getDatamodel(): PothosPrismaDatamodel { return JSON.parse("{\"datamodel\":{\"models\":{\"Viewer\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"displayName\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"email\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"profilePicture\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slackToken\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slackScopes\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true},{\"type\":\"BandApplication\",\"kind\":\"object\",\"name\":\"BandApplication\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"BandApplicationComment\",\"kind\":\"object\",\"name\":\"BandApplicationComment\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationCommentToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"BandApplicationRating\",\"kind\":\"object\",\"name\":\"BandApplicationRating\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationRatingToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Nonce\",\"kind\":\"object\",\"name\":\"Nonce\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"NonceToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"ViewerLocation\",\"kind\":\"object\",\"name\":\"ViewerLocation\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ViewerToViewerLocation\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"NonceRequest\",\"kind\":\"object\",\"name\":\"NonceRequest\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"NonceRequestToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"BandApplicationTag\",\"kind\":\"object\",\"name\":\"BandApplicationTag\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationTagToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"CrewCard\",\"kind\":\"object\",\"name\":\"CrewCard\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CrewCardToViewer\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Area\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"displayName\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"order\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"themeColor\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"latitude\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"longitude\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"AreaOpeningHour\",\"kind\":\"object\",\"name\":\"areaOpeningHour\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"AreaToAreaOpeningHour\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"BandPlaying\",\"kind\":\"object\",\"name\":\"BandPlaying\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"AreaToBandPlaying\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"AreaOpeningHour\":{\"fields\":[{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startTime\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"endTime\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"areaId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Area\",\"kind\":\"object\",\"name\":\"area\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"AreaToAreaOpeningHour\",\"relationFromFields\":[\"areaId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Page\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"content\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"left\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"right\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"bottom\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ProductList\":{\"fields\":[{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"emoji\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"active\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Device\",\"kind\":\"object\",\"name\":\"Device\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"DeviceToProductList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"OrderItem\",\"kind\":\"object\",\"name\":\"OrderItem\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderItemToProductList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Product\",\"kind\":\"object\",\"name\":\"product\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ProductToProductList\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Product\":{\"fields\":[{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"price\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"order\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"productListId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"requiresDeposit\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ProductList\",\"kind\":\"object\",\"name\":\"productList\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ProductToProductList\",\"relationFromFields\":[\"productListId\"],\"isUpdatedAt\":false},{\"type\":\"ProductAdditives\",\"kind\":\"object\",\"name\":\"additives\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ProductToProductAdditives\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ProductAdditives\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"displayName\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Product\",\"kind\":\"object\",\"name\":\"Product\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ProductToProductAdditives\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Device\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastSeen\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"productListId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"softwareVersion\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DeviceType\",\"kind\":\"enum\",\"name\":\"type\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ProductList\",\"kind\":\"object\",\"name\":\"productList\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"DeviceToProductList\",\"relationFromFields\":[\"productListId\"],\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"Order\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"DeviceToOrder\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DeviceLog\",\"kind\":\"object\",\"name\":\"DeviceLog\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"DeviceToDeviceLog\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Order\":{\"fields\":[{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OrderPayment\",\"kind\":\"enum\",\"name\":\"payment\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"deposit\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"deviceId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Device\",\"kind\":\"object\",\"name\":\"device\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"DeviceToOrder\",\"relationFromFields\":[\"deviceId\"],\"isUpdatedAt\":false},{\"type\":\"OrderItem\",\"kind\":\"object\",\"name\":\"items\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"CardTransaction\",\"kind\":\"object\",\"name\":\"CardTransaction\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CardTransactionToOrder\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Bytes\",\"kind\":\"scalar\",\"name\":\"crewCardId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"CrewCard\",\"kind\":\"object\",\"name\":\"crewCard\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CrewCardToOrder\",\"relationFromFields\":[\"crewCardId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"OrderItem\":{\"fields\":[{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"orderId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"amount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"perUnitPrice\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"productListId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"order\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[\"orderId\"],\"isUpdatedAt\":false},{\"type\":\"ProductList\",\"kind\":\"object\",\"name\":\"productList\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderItemToProductList\",\"relationFromFields\":[\"productListId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"CardTransaction\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"clientId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"cardId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"depositBefore\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"depositAfter\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"balanceBefore\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"balanceAfter\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"CardTransactionType\",\"kind\":\"enum\",\"name\":\"transactionType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"counter\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DeviceLog\",\"kind\":\"object\",\"name\":\"deviceLog\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CardTransactionToDeviceLog\",\"relationFromFields\":[\"clientId\"],\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"Order\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CardTransactionToOrder\",\"relationFromFields\":[\"orderId\"],\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"orderId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"CrewCard\":{\"fields\":[{\"type\":\"Bytes\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"validUntil\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nickname\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"suspended\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"privileged\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"viewerId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"viewer\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CrewCardToViewer\",\"relationFromFields\":[\"viewerId\"],\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"Order\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CrewCardToOrder\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"enrolledAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"DeviceLog\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"clientId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"batteryVoltage\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"usbVoltage\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"deviceId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"deviceTime\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Device\",\"kind\":\"object\",\"name\":\"device\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"DeviceToDeviceLog\",\"relationFromFields\":[\"deviceId\"],\"isUpdatedAt\":false},{\"type\":\"CardTransaction\",\"kind\":\"object\",\"name\":\"CardTransaction\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CardTransactionToDeviceLog\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"BandApplication\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"email\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"bandname\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"genre\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"city\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"facebook\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"demo\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"numberOfArtists\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"numberOfNonMaleArtists\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"contactName\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"contactPhone\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"knowsKultFrom\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"distance\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"facebookLikes\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"website\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"GenreCategory\",\"kind\":\"enum\",\"name\":\"genreCategory\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"HeardAboutBookingFrom\",\"kind\":\"enum\",\"name\":\"heardAboutBookingFrom\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"contactedByViewerId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"instagram\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"instagramFollower\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"eventId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"PreviouslyPlayed\",\"kind\":\"enum\",\"name\":\"hasPreviouslyPlayed\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"lastContactedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"latitude\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"longitude\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"demoEmbedUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"demoEmbed\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DemoEmbedType\",\"kind\":\"enum\",\"name\":\"demoEmbedType\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"contactedByViewer\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToViewer\",\"relationFromFields\":[\"contactedByViewerId\"],\"isUpdatedAt\":false},{\"type\":\"Event\",\"kind\":\"object\",\"name\":\"event\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToEvent\",\"relationFromFields\":[\"eventId\"],\"isUpdatedAt\":false},{\"type\":\"BandApplicationComment\",\"kind\":\"object\",\"name\":\"bandApplicationComment\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToBandApplicationComment\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"BandApplicationRating\",\"kind\":\"object\",\"name\":\"bandApplicationRating\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToBandApplicationRating\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"spotifyArtist\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"spotifyMonthlyListeners\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BandRepertoire\",\"kind\":\"enum\",\"name\":\"repertoire\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BandApplicationTag\",\"kind\":\"object\",\"name\":\"BandApplicationTag\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToBandApplicationTag\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"BandApplicationTag\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"bandApplicationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"tag\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"createdByViewerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BandApplication\",\"kind\":\"object\",\"name\":\"bandApplication\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToBandApplicationTag\",\"relationFromFields\":[\"bandApplicationId\"],\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"createdByViewer\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationTagToViewer\",\"relationFromFields\":[\"createdByViewerId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"bandApplicationId\",\"tag\"]}]},\"BandApplicationRating\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"viewerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"rating\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"bandApplicationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BandApplication\",\"kind\":\"object\",\"name\":\"bandApplication\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToBandApplicationRating\",\"relationFromFields\":[\"bandApplicationId\"],\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"viewer\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationRatingToViewer\",\"relationFromFields\":[\"viewerId\"],\"isUpdatedAt\":false}],\"primaryKey\":{\"name\":null,\"fields\":[\"viewerId\",\"bandApplicationId\"]},\"uniqueIndexes\":[]},\"BandApplicationComment\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"viewerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"comment\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"bandApplicationId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BandApplication\",\"kind\":\"object\",\"name\":\"bandApplication\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToBandApplicationComment\",\"relationFromFields\":[\"bandApplicationId\"],\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"viewer\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationCommentToViewer\",\"relationFromFields\":[\"viewerId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Event\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"start\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"end\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"EventType\",\"kind\":\"enum\",\"name\":\"eventType\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"bandApplicationStart\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"djApplicationStart\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"bandApplicationEnd\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"djApplicationEnd\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"poster\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"BandApplication\",\"kind\":\"object\",\"name\":\"bandApplication\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandApplicationToEvent\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"BandPlaying\",\"kind\":\"object\",\"name\":\"BandPlaying\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandPlayingToEvent\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"location\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"latitude\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"longitude\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"BandPlaying\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startTime\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"endTime\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"shortDescription\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"genre\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"instagram\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"spotify\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"facebook\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"website\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"youtube\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"soundcloud\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"areaId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"eventId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"photo\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Area\",\"kind\":\"object\",\"name\":\"area\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"AreaToBandPlaying\",\"relationFromFields\":[\"areaId\"],\"isUpdatedAt\":false},{\"type\":\"Event\",\"kind\":\"object\",\"name\":\"event\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"BandPlayingToEvent\",\"relationFromFields\":[\"eventId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"announcementTime\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"areaId\",\"startTime\"]},{\"name\":null,\"fields\":[\"eventId\",\"slug\"]}]},\"Nonce\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"nonce\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"createdForId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"createdFor\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"NonceToViewer\",\"relationFromFields\":[\"createdForId\"],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"NonceRequest\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"expiresAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"createdForId\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"createdFor\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"NonceRequestToViewer\",\"relationFromFields\":[\"createdForId\"],\"isUpdatedAt\":false},{\"type\":\"NonceRequestStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"GmailReminders\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"messageId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"account\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"DevicePrivilegeToken\":{\"fields\":[{\"type\":\"Bytes\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"label\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"DeviceConfigVersion\":{\"fields\":[{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"crc32\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"version\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"News\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"title\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"content\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"TwoFactor\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"account\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"service\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"secret\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"account\",\"service\"]}]},\"ItemLocation\":{\"fields\":[{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"timeStamp\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"latitude\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"longitude\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"payload\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ViewerLocation\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"viewerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Viewer\",\"kind\":\"object\",\"name\":\"viewer\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ViewerToViewerLocation\",\"relationFromFields\":[\"viewerId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"latitude\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Float\",\"kind\":\"scalar\",\"name\":\"longitude\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Json\",\"kind\":\"scalar\",\"name\":\"payload\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ShortDomainRedirect\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"slug\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"targetUrl\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Donation\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"amount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"email\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"namePrivate\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"sentConfirmationAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"spendenQuittungAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"message\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"reference\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DonationSource\",\"kind\":\"enum\",\"name\":\"source\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"quittungName\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"quittungStreet\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"quittungCity\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"amountPins\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]}}}}"); }