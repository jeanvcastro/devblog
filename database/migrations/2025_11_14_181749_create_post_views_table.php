<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("post_views", function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->unique();
            $table
                ->foreignId("post_id")
                ->constrained("posts")
                ->onDelete("cascade");
            $table->string("visitor_hash");
            $table
                ->foreignId("user_id")
                ->nullable()
                ->constrained("users")
                ->onDelete("set null");
            $table->timestamp("visited_at")->useCurrent();
            $table->timestamps();
            $table->softDeletes();

            $table->index("uuid");
            $table->unique(["post_id", "visitor_hash", "visited_at"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("post_views");
    }
};
