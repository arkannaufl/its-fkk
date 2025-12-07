import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Unit, User } from '../../hooks/useOrganizationalChartData';

interface OrganizationalChartPDFProps {
  units: Unit[];
  unassignedUsers: User[];
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 9,
    flexDirection: 'column',
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: '2 solid #3b82f6',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#4b5563',
    marginTop: 2,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 4,
  },
  unitCard: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    border: '1 solid #d1d5db',
    borderRadius: 6,
    minWidth: 200,
    maxWidth: 220,
  },
  rootUnitCard: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#faf5ff',
    border: '2 solid #9333ea',
    borderRadius: 8,
    borderLeftWidth: 5,
    minWidth: 240,
    maxWidth: 260,
  },
  unitHeader: {
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: '1 solid #e5e7eb',
  },
  unitName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  unitCode: {
    fontSize: 9,
    color: '#6b7280',
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  userCard: {
    marginTop: 6,
    marginBottom: 4,
    padding: 6,
    backgroundColor: '#ffffff',
    border: '1 solid #e5e7eb',
    borderRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    fontSize: 9,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    lineHeight: 1.2,
  },
  userEmail: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
    marginLeft: 30,
  },
  badge: {
    padding: '2 6',
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 'bold',
    marginTop: 3,
    marginLeft: 30,
  },
  badgeAdmin: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  badgeDekan: {
    backgroundColor: '#f3e8ff',
    color: '#9333ea',
  },
  badgeWadek: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  badgeUnit: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  badgeSDM: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
  badgeUnassigned: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  treeContainer: {
    alignItems: 'center',
  },
  childrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 12,
  },
  connectorLine: {
    width: 1.5,
    height: 20,
    backgroundColor: '#6b7280',
    margin: '0 auto',
    marginBottom: 8,
    marginTop: 3,
  },
  unassignedSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    border: '1.5 solid #e5e7eb',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
  },
  unassignedTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  unassignedUserList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 7,
    color: '#6b7280',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 6,
    fontStyle: 'italic',
  },
});

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoleBadgeStyle = (role?: string) => {
  switch (role) {
    case 'admin':
      return styles.badgeAdmin;
    case 'dekan':
      return styles.badgeDekan;
    case 'wadek':
      return styles.badgeWadek;
    case 'unit':
      return styles.badgeUnit;
    case 'sdm':
      return styles.badgeSDM;
    default:
      return styles.badgeUnassigned;
  }
};

const getRoleLabel = (role?: string): string => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'dekan':
      return 'Dekan';
    case 'wadek':
      return 'Wadek';
    case 'unit':
      return 'Unit';
    case 'sdm':
      return 'SDM';
    default:
      return 'Belum Di-assign';
  }
};

const UserCardPDF: React.FC<{ user: User }> = ({ user }) => {
  const initials = getInitials(user.name);
  const badgeStyle = getRoleBadgeStyle(user.role);
  const badgeLabel = getRoleLabel(user.role);

  return (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
      </View>
      <Text style={styles.userEmail}>{user.email}</Text>
      <View style={[styles.badge, badgeStyle]}>
        <Text>{badgeLabel}</Text>
      </View>
    </View>
  );
};

const UnitCardPDF: React.FC<{
  unit: Unit;
  isRoot?: boolean;
  childUnitsMap: Map<number, Unit[]>;
}> = ({ unit, isRoot = false, childUnitsMap }) => {
  const children = childUnitsMap.get(unit.id) || [];
  const cardStyle = isRoot ? styles.rootUnitCard : styles.unitCard;

  return (
    <View style={{ alignItems: 'center', marginBottom: 5 }}>
      <View style={cardStyle}>
        <View style={styles.unitHeader}>
          <Text style={styles.unitName}>{unit.name}</Text>
          <Text style={styles.unitCode}>{unit.code}</Text>
        </View>
        {unit.users && unit.users.length > 0 && (
          <View>
            {unit.users.map((user) => (
              <UserCardPDF key={user.id} user={user} />
            ))}
          </View>
        )}
      </View>

      {children.length > 0 && (
        <>
          <View style={styles.connectorLine} />
          <View style={styles.childrenContainer}>
            {children.map((child) => (
              <UnitCardPDF
                key={child.id}
                unit={child}
                childUnitsMap={childUnitsMap}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export const OrganizationalChartPDF: React.FC<OrganizationalChartPDFProps> = ({
  units,
  unassignedUsers,
}) => {
  // Build child units map
  const childUnitsMap = new Map<number, Unit[]>();
  units.forEach((unit) => {
    if (unit.parent_unit_id) {
      if (!childUnitsMap.has(unit.parent_unit_id)) {
        childUnitsMap.set(unit.parent_unit_id, []);
      }
      childUnitsMap.get(unit.parent_unit_id)!.push(unit);
    }
  });

  // Get root units (units without parent)
  const rootUnits = units.filter((unit) => !unit.parent_unit_id);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Struktur Organisasi</Text>
          <Text style={styles.subtitle}>
            Fakultas - Sistem Manajemen Terintegrasi
          </Text>
          <Text style={styles.date}>Dicetak pada: {currentDate}</Text>
        </View>

        {/* Organizational Chart - Compact Landscape Layout */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Main Chart Section */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            {rootUnits.length > 0 ? (
              <View style={{ alignItems: 'center' }}>
                {rootUnits.map((rootUnit) => (
                  <View key={rootUnit.id} style={{ alignItems: 'center', width: '100%' }}>
                    <UnitCardPDF
                      unit={rootUnit}
                      isRoot={true}
                      childUnitsMap={childUnitsMap}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text style={{ color: '#9ca3af', fontSize: 9 }}>
                  Belum ada struktur organisasi
                </Text>
              </View>
            )}
          </View>

          {/* Unassigned Users Section - Sidebar */}
          {unassignedUsers.length > 0 && (
            <View style={[styles.unassignedSection, { flex: 0, minWidth: 180, maxWidth: 200, marginLeft: 10 }]}>
              <Text style={styles.unassignedTitle}>
                User Belum Di-assign ({unassignedUsers.length})
              </Text>
              <View style={styles.unassignedUserList}>
                {unassignedUsers.map((user) => (
                  <UserCardPDF key={user.id} user={user} />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Dokumen ini dihasilkan secara otomatis dari Sistem Manajemen Terintegrasi
          </Text>
        </View>
      </Page>
    </Document>
  );
};

