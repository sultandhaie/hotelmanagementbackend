<?php

namespace App\Providers;

use App\Models\Facility;
use App\Models\MeetingRoom;
use App\Models\Room;
use App\Models\Villa;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'villa' => Villa::class,
            'meeting_room' => MeetingRoom::class,
            'facility' => Facility::class,
            'room' => Room::class,
        ]);
    }
}
