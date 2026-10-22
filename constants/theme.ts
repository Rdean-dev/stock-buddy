import type { TextStyle } from "react-native";

export const theme = {
    colors: {
        controlBorder: "#D9E1EA",
        cardBorderColor: '#E2E8F0',
        labelColor: '#475569',
        cardBackgroundColor: '#FFFFFF',
        positive: '#16A34A',
        negative: '#DC2626',

    },
    spacing: {
        formRowgap: 20,
        pageHorizontalMargin: 24,
        sectionTopMargin: 24,
        cardPadding: 24,
    },
    radii:{
        cardRadius: 12,
        controlRadius: 8
    },
    typography:{
        labelSize:14,
        
        labelWeight: "400" as const,
        labelFamily: 'Arial',
    },
    sizes:{
        controlHeight: 42,
    },
    subtitle:{
        lineHeight: 22,
        fontSize: 16,
        fontWeight: "400", 
        color: '#64748B', 
        paddingHorizontal: 24, 
        paddingTop: 0, 
        paddingBottom: 20,
    }satisfies TextStyle,
};