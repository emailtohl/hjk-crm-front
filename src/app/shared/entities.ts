export class Csrf {
    public headerName: string;
    public parameterName: string;
    public token: string;
}

export class Principal {
    public authenticated: boolean;
    public authorities: Array<any>;
    public credentials: any;
    public details: { remoteAddress: string, sessionId: string };
    public name: string;
    public principal: {
        accountNonExpired: boolean,
        accountNonLocked: boolean,
        authorities: Array<any>;
        credentialsNonExpired: boolean;
        enabled: boolean;
        password: string;
        username: string;
    };

    public static getUserId(principal: Principal): string {
        if (!principal.name) {
            return '';
        }
        return principal.name.split(':')[0];
    }

    public static getUserName(principal: Principal): string {
        if (!principal.name) {
            return '';
        }
        const arr = principal.name.split(':');
        return arr[1] ? arr[1] : '';
    }

    public static getUserGroups(principal: Principal): Set<string> {
        const groups = new Set<string>();
        if (!principal.name) {
            return groups;
        }
        const arr = principal.name.split(':');
        if (!arr[2]) {
            return groups;
        }
        arr[2].split(',').forEach(group => groups.add(group));
        return groups;
    }
}

