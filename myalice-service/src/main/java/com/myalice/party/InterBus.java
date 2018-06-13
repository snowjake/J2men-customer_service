package com.myalice.party;

public abstract class InterBus {

	public static enum BusType {
		TULING
	}

	public abstract String call(String info);

	public static InterBus getBus(BusType busType) {
		if (busType == BusType.TULING) {
			return new BranchTuling();
		}
		return null;
	}
}
