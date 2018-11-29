<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_tag', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->unsignedInteger('category_id');
            $table->unsignedInteger('tag_id');

            $table->foreign('category_id')->references('id')->on('ch_categories');
            $table->foreign('tag_id')->references('id')->on('ch_tags');
            $table->index(['category_id','tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_tag');
    }
}
