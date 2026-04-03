/**
 * 
 * DataDirsContext — loads reference/location data and lazy-loads auth-only
 * district/block/gram panchayat lists for dependent dropdowns.
 *
 * APIs used:
 *   GET /api/v1/districts           → auth required
 *   GET /api/v1/blocks              → auth required, requires district_id
 *   GET /api/v1/gram_panchayats     → auth required, requires block_id
 *
 * All items have numeric `id` fields. Relationships:
 *   block.district_id        → belongs to district
 *   gram_panchayat.block_id  → belongs to block
 *   village.gram_panchayat_id→ belongs to gram panchayat
 *   mouza.block_id           → belongs to block
 *   police_station.district_id→ belongs to district
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { listDistricts, listBlocks, listGramPanchayats } from '../api/client';

const DataDirsContext = createContext(null);

export function useDataDirs() {
  return useContext(DataDirsContext);
}

export function DataDirsProvider({ children }) {
  const [districts, setDistricts]         = useState([]);
  const [blocks, setBlocks]               = useState([]);
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [villages, setVillages]           = useState([]);
  const [mouzas, setMouzas]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [locationLoading, setLocationLoading] = useState({
    districts: false,
    blocks: false,
    gramPanchayats: false,
  });
  const [loadedBlockDistrictIds, setLoadedBlockDistrictIds] = useState({});
  const [loadedGpBlockIds, setLoadedGpBlockIds] = useState({});

  const mergeUniqueById = useCallback((prev, incoming) => {
    const map = new Map(prev.map((item) => [Number(item.id), item]));
    incoming.forEach((item) => {
      if (item?.id != null) map.set(Number(item.id), item);
    });
    return Array.from(map.values());
  }, []);

  const loadDistrictOptions = useCallback(async () => {
    setLocationLoading((prev) => ({ ...prev, districts: true }));
    try {
      const items = await listDistricts();
      setDistricts((prev) => mergeUniqueById(prev, items));
      return items;
    } catch (e) {
      console.error('[DataDirs] Failed to load districts:', e);
      setError(e.message);
      return [];
    } finally {
      setLocationLoading((prev) => ({ ...prev, districts: false }));
    }
  }, [mergeUniqueById]);

  const loadBlocksByDistrict = useCallback(async (districtId) => {
    if (!districtId) return [];

    const key = String(districtId);
    if (loadedBlockDistrictIds[key]) {
      return blocks.filter((b) => Number(b.district_id) === Number(districtId));
    }

    setLocationLoading((prev) => ({ ...prev, blocks: true }));
    try {
      const items = await listBlocks(districtId);
      setBlocks((prev) => mergeUniqueById(prev, items));
      setLoadedBlockDistrictIds((prev) => ({ ...prev, [key]: true }));
      return items;
    } catch (e) {
      console.error('[DataDirs] Failed to load blocks:', e);
      setError(e.message);
      return [];
    } finally {
      setLocationLoading((prev) => ({ ...prev, blocks: false }));
    }
  }, [blocks, loadedBlockDistrictIds, mergeUniqueById]);

  const loadGpsByBlock = useCallback(async (blockId) => {
    if (!blockId) return [];

    const key = String(blockId);
    if (loadedGpBlockIds[key]) {
      return gramPanchayats.filter((g) => Number(g.block_id) === Number(blockId));
    }

    setLocationLoading((prev) => ({ ...prev, gramPanchayats: true }));
    try {
      const items = await listGramPanchayats(blockId);
      setGramPanchayats((prev) => mergeUniqueById(prev, items));
      setLoadedGpBlockIds((prev) => ({ ...prev, [key]: true }));
      return items;
    } catch (e) {
      console.error('[DataDirs] Failed to load gram panchayats:', e);
      setError(e.message);
      return [];
    } finally {
      setLocationLoading((prev) => ({ ...prev, gramPanchayats: false }));
    }
  }, [gramPanchayats, loadedGpBlockIds, mergeUniqueById]);

  // ── Filtered lookup helpers (return arrays) ─────────────────────────────────

  /** Blocks for a given district id (string or number) */
  const blocksByDistrict = (districtId) =>
    districtId ? blocks.filter((b) => b.district_id === Number(districtId)) : [];

  /** Gram Panchayats for a given block id */
  const gpsByBlock = (blockId) =>
    blockId ? gramPanchayats.filter((g) => g.block_id === Number(blockId)) : [];

  /** Villages for a given gram panchayat id */
  const villagesByGP = (gpId) =>
    gpId ? villages.filter((v) => v.gram_panchayat_id === Number(gpId)) : [];

  /** Mouzas for a given block id */
  const mouzasByBlock = (blockId) =>
    blockId ? mouzas.filter((m) => m.block_id === Number(blockId)) : [];

  /** Police stations for a given district id */
  const policeStationsByDistrict = (districtId) =>
    districtId ? policeStations.filter((p) => p.district_id === Number(districtId)) : [];

  // ── Name lookup helpers (id → name string) ──────────────────────────────────

  const districtName      = (id) => districts.find((d)      => d.id === Number(id))?.name || '';
  const blockName         = (id) => blocks.find((b)          => b.id === Number(id))?.name || '';
  const gpName            = (id) => gramPanchayats.find((g)  => g.id === Number(id))?.name || '';
  const villageName       = (id) => villages.find((v)        => v.id === Number(id))?.name || '';
  const mouzaName         = (id) => mouzas.find((m)          => m.id === Number(id))?.name || '';
  const policeStationName = (id) => policeStations.find((p)  => p.id === Number(id))?.name || '';

  return (
    <DataDirsContext.Provider value={{
      // Raw arrays
      districts, blocks, gramPanchayats, policeStations, villages, mouzas,
      // Filter helpers (id → filtered array)
      blocksByDistrict, gpsByBlock, villagesByGP, mouzasByBlock, policeStationsByDistrict,
      loadDistricts: loadDistrictOptions, loadBlocksByDistrict, loadGpsByBlock,
      // Name lookup helpers (id → name string)
      districtName, blockName, gpName, villageName, mouzaName, policeStationName,
      // State
      loading, error, locationLoading,
    }}>
      {children}
    </DataDirsContext.Provider>
  );
}
